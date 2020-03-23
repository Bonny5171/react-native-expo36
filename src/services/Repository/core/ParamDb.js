import squel from '../squelConfig';
const arrayToObject = (array, keyField, keyValue, valueDefault) =>
  array.reduce((obj, item) => {
    let value = (item[keyValue]);
    if (!value) {
      value = valueDefault || process.env[keyField];
    } else {
      if (item.type === 'dj' || item.type === 'ds') {
        const d = new Date(value);
        value = (new Date(d.getTime() + (d.getTimezoneOffset() * 60000))).getTime();
      } else if (item.type === 's') {
        value = value.replace(/['"]+/g, '');
      } else if (item.type === 'n') {
        value *= 1;
      } else if (item.type === 'b') {
        value = (JSON.parse(value) === true);
      } else if (item.type === 'a') {
        value = JSON.parse(value);
      } else if (item.type === 'o') {
        value = JSON.parse(value);
      }
    }

    obj[item[keyField]] = value;
    return obj;
  }, {});

class ParamDb {
  constructor(db) {
    this.db = db;
    this.LOCAL_DATE_TIME = "strftime('%Y-%m-%dT%H:%M:%fZ', 'now', 'localtime')";
  }

  async getAll(names = [], noTranform) {
    try {
      const select = squel
      .select()
      .field('id')
      .field('value')
      .field('type')
      .from('parameter');

      if (names.length > 0) select.where('id in ?', names);
      // console.log('select.toString()', select.toString());
      const result = await this.db.query(select);
      return arrayToObject(result._array, 'id', 'value', '');
    } catch (error) {
      return [];
    }
  }

  async set(name = null, value) {
    const select = squel
    .update()
    .table('parameter')
    .set('value', value, { dontQuote: this.LOCAL_DATE_TIME === value })
    .set('updated_at', this.LOCAL_DATE_TIME, { dontQuote: true });
    if (name) select.where('id = ?', name);
    // console.log('select.toString()', select.toString());
    return await this.db.exec(select.toString());
  }
}

export default ParamDb;