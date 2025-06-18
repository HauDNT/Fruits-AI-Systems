import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isIntegerString', async: false })
export class IsIntegerStringConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments) {
    return typeof value === 'string' && /^-?\d+$/.test(value.trim());
  }

  defaultMessage(_args: ValidationArguments) {
    return 'Giá trị phải là một chuỗi số nguyên hợp lệ';
  }
}

export function IsIntegerString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsIntegerStringConstraint,
    });
  };
}
