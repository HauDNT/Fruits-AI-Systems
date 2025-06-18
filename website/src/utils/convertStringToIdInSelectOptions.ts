export const convertStringToIdInSelectOptions = <T extends string | number>(
  labelString: string,
  dataOptions: any[],
  fieldIdName: string = 'id',
  fieldOption: string,
): T => {
  if (labelString && labelString.length > 0 && fieldOption && fieldOption.length > 0) {
    const normalizedLabel = labelString.trim().toLowerCase();

    const found = dataOptions.find((item) => {
      const optionLabel = item[fieldOption]?.toLowerCase().trim();
      return optionLabel === normalizedLabel;
    });

    if (found) {
      return found[fieldIdName] as T;
    }
  }

  return (typeof ('' as T) === 'string' ? '' : -1) as T;
};
