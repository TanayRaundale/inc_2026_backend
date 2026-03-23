function adminQueries(tableName) {
  const resolvedTable = tableName || 'admin';
  const findAdmin = `SELECT username, password, roles FROM ${resolvedTable} WHERE username = ? LIMIT 1;`

  return {
    findAdmin,
  }
}

export { adminQueries }
