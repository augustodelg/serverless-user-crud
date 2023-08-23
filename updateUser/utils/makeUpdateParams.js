export function makeUpdateParams(tableName, key, attributesToUpdate) {
  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};
  let UpdateExpression = "SET ";

  // For each attribute to update, add it to the UpdateExpression and build the ExpressionAttributeNames and ExpressionAttributeValues objects
  Object.entries(attributesToUpdate).forEach(
    ([attributeName, attributeValue]) => {
      const keyName = `#${attributeName}`;
      const valueName = `:${attributeName}`;
      UpdateExpression += `${keyName} = ${valueName}, `;
      ExpressionAttributeNames[keyName] = attributeName;
      ExpressionAttributeValues[valueName] = attributeValue;
    }
  );

  // Remove the trailing comma and space from the UpdateExpression
  UpdateExpression = UpdateExpression.slice(0, -2);

  // Build the params object with the tableName, key, UpdateExpression, and ExpressionAttributeNames and ExpressionAttributeValues objects
  const params = {
    TableName: tableName,
    Key: { pk: key },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  return params;
}