import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({ async: false })
export class IsDateFormatConstraint implements ValidatorConstraintInterface {
  validate(dateStr: string) {
    // Regex to match 'dd/mm/yyyy hh:mm:ss' or 'dd/mm/yyyy' format
    const dateTimeRegex =
      /^([0-2][0-9]|(3)[0-1])\/(0[1-9]|1[0-2])\/\d{4}( ([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]))?$/
    return dateTimeRegex.test(dateStr)
  }

  defaultMessage() {
    return 'Date must be in the format "dd/mm/yyyy hh:mm:ss"'
  }
}

export function IsDateFormat(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDateFormatConstraint,
    })
  }
}
