import { repository, queryBuilder as query, param } from '../Repository/SetupDb';

class Setup {
  static async saveParameter(name, value) {
    const repo = await repository();
    return repo.param.set(name, value);
  }

  // static async fetch(expr, thumb = false) {
  //   const q = query
  //     .select()
  //     .field("printf('data:%s;base64,%s', content_type, full_content_b64)", 'fullContent')
  //     .from('resource_metadata')
  //     .where("is_deleted = ?", false)
  //     .where("is_active = ?", true);

  //   if (thumb) {
  //     q.field("printf('data:image/png;base64,%s', preview_content_b64)", 'previewContent');
  //   }
  //   const repo = await repository();
  //   return await repo.queryOne(
  //     q.where(expr)
  //   );
  // }

  // static async getById(id, thumb = false) {
  //   return Resource.fetch(query.expr().and("id = ?", id), thumb);
  // }

  // static async getByFileName(fileName, thumb = false) {
  //   return Resource.fetch(query.expr().and("original_file_name = ?", fileName), thumb);
  // }
}

export default Setup;