columnArray.forEach(columnName => {
    var object = {};
    var tableData = [];
    var expectedKey = tableName + "_" + columnName;
    object["heading"] = myData.columns.expectedKey;

    myData.rowset.forEach((item) => {
        for (key in item) {
            if (key === expectedKey) {
                tableData.push(item[key]);
            }
        }
    })
})
