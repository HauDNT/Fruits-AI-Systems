export const onChangeDataEachFieldChange = (
    nameField: string,
    newValue: string | number,
    callback: (field: string, value: string | number) => void,
) => {
    if (!nameField) {
        console.error('Tên trường không phù hợp');
        return;
    };

    callback(nameField, newValue);
}