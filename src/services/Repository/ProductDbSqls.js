const cmds = [
  {
    name: 'vw_product_tags',
    down: 'DROP VIEW IF EXISTS vw_product_tags;',
    up:
      `
  CREATE VIEW vw_product_tags AS
  WITH RECURSIVE split (
  content,
  last,
  rest
  )
  AS (
      VALUES (
          '',
          '',
          (
            SELECT DISTINCT group_concat(DISTINCT [REPLACE](sfa_labels_list, ';', ',')) AS "s" FROM sfa_product_cat WHERE (sf_pricebook2id = '01s6C000000LTk8QAG') AND (sfa_record_type = 'all')
          )
      )
      UNION ALL
      SELECT CASE WHEN last = ',' THEN substr(rest, 1, 1) ELSE content || substr(rest, 1, 1) END,
            substr(rest, 1, 1),
            substr(rest, 2) 
        FROM split
      WHERE rest <> ''
  )
  SELECT DISTINCT [REPLACE](content, ',', '') AS ValueSplit
    FROM split
  WHERE last = ',' OR 
        rest = '';`
  },
  // {
  //   name: 'add_coll_sfa_max_desconto',
  //   down: '',
  //   up:
  //     'ALTER TABLE sfa_product_price_book ADD sfa_max_desconto INTEGER;'
  // },
  // {
  //   name: 'set_max_desconto',
  //   down: '',
  //   up:
  //     'UPDATE sfa_product_price_book SET sfa_max_desconto = 50;'
  // }
];

export { cmds };