const cmds = [
  // vw_account
  {
    name: 'vw_resource_metadata',
    down: 'DROP VIEW IF EXISTS vw_resource_metadata;',
    up:
      `
  CREATE VIEW vw_resource_metadata AS
  SELECT
    rm.id,
    (CASE
        WHEN (length(rm.full_content_b64)/p.size_page) = 0 THEN
          printf('data:%s;base64,%s', rm.content_type, rm.full_content_b64)
        ELSE
          null
    END
    ) AS fullContent,
    rm.content_type,
    rm.sf_content_document_id,
    rm.original_file_name,
    rm.ref1,
    rm.ref2,
    rm.size_type,
    rm.sequence,
    p.size_page,
    length(rm.full_content_b64) as size_b64,
    (length(rm.full_content_b64)/p.size_page) as total_pages
  FROM
    (SELECT 2000000 size_page) p,
    resource_metadata rm
    ;      
    `
  }
];
// (is_deleted = ('false') ) AND
export { cmds };
