import { repository, queryBuilder as query, param } from '../Repository/ResourceDb';

class Resource {
  constructor() {
  }

  static async saveParameter(name, value) {
    const repo = await repository(true);
    return repo.param.set(name, value);
  }

  static async fetchPart(id, contentType, size_B64, sizePage, position = 1) {
    return new Promise(async (resolve, reject) => {
      const selects = [];

      while (size_B64 >= position) {
        selects.push(
          query.select()
            .field(`substr(full_content_b64,${position},${sizePage})`, 'fullContent')
            .from('resource_metadata')
            .where('id = ?', id));

        position += sizePage;
      }

      const repo = await repository();

      if (repo) {
        const r = await repo.queryQueue(selects, true, true);

        const fullContent = r.map((result) => {
          return result.fullContent;
        }).join('');

        resolve(`data:${contentType};base64,${fullContent}`);
      }

      resolve();
    });
  }

  static async fetch(expr) {
    return new Promise(async (resolve, reject) => {
      const q = query
        .select()
        .field('id')
        .field('content_type')
        .field('fullContent')
        .field('size_page')
        .field('size_b64')
        .field('total_pages')
        .from('vw_resource_metadata');

      const select = q.where(expr);
      const repo = await repository();

      if (repo) {
        const r = await repo.queryOne(select);

        if (r !== null) {
          if (r.total_pages > 0 && r.fullContent === null) {
            r.fullContent = await this.fetchPart(r.id, r.content_type, r.size_b64, r.size_page);
            resolve(r);
          } else {
            resolve(r);
          }
        }
      }

      resolve();
    });
  }

  static async getById(id, thumb = false) {
    return Resource.fetch(query.expr().and('id = ?', id), thumb);
  }

  static async getByFileName(fileName, thumb = false) {
    return Resource.fetch(query.expr().and('original_file_name like ?', `${fileName}%`), thumb);
  }

  static async getByRefs(ref1, ref2, sizeType, sequence, thumb = false) {
    const where = query.expr();

    where.and('ref1 = ?', ref1);
    where.and('ref2 = ?', ref2);
    where.and('size_type = ?', sizeType);
    where.and('sequence = ?', sequence);

    return Resource.fetch(where, thumb);
  }

  static async getBySfContentDocumentId(documentId, thumb = false) {
    const select = query.expr().and('sf_content_document_id = ?', documentId);
    return Resource.fetch(select, thumb);
  }

  static async getGallery(productCode, colorCode, sizeType = 's') {
    const repo = await repository();
    const select = query.select()
      .field('ref1', 'product_code')
      .field('ref2', 'color_code')
      .field('sequence')
      .field('original_file_name')
      .from('resource_metadata')
      .where('ref1 = ?', productCode)
      .where('ref2 = ?', colorCode)
      .where('size_type = ?', sizeType)
      .order('ref1')
      .order('ref2')
      .order('sequence')
      .distinct();
    const gallery = await repo.query(select);
    // console.log('select.toString()', select.toString())
    return gallery === undefined ? { _array: [] } : gallery;
  }
}

export default Resource;
