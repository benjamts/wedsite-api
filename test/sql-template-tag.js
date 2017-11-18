const assert = require('assert');
const sql = require('../src/sql-template-tag');


describe('sql template tag', function() {
  it('strips superfluous whitespace', function() {
    assert.equal(sql`
      SELECT 1
      FROM foo_table
      WHERE stuff IS TRUE;
    `, 'SELECT 1 FROM foo_table WHERE stuff IS TRUE;');
  });

  it('handles interpolation', function() {
    assert.equal(sql`
      SELECT 1
      FROM foo_table
      WHERE stuff IS ${'TRUE'};
    `, 'SELECT 1 FROM foo_table WHERE stuff IS TRUE;');
  });

  it('handles lots of interpolation', function() {
    assert.equal(sql`
      ${'SELECT'} ${1}
      FROM foo_table
      WHERE stuff IS ${'TRUE;'}
    `, 'SELECT 1 FROM foo_table WHERE stuff IS TRUE;');
  });

  it('handles leading interpolation', function() {
    assert.equal(sql`${'SELECT'} ${1}
      FROM foo_table
      WHERE stuff IS ${'TRUE;'}
    `, 'SELECT 1 FROM foo_table WHERE stuff IS TRUE;');
  });

  it('handles trailing interpolation', function() {
    assert.equal(sql`${'SELECT'} ${1}
      FROM foo_table
      WHERE stuff IS ${'TRUE;'}`,
      'SELECT 1 FROM foo_table WHERE stuff IS TRUE;'
    );
  });
});