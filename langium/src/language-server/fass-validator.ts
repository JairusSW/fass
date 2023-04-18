import { ValidationAcceptor, ValidationChecks } from 'langium';
import { FassAstType, Person } from './generated/ast';
import type { FassServices } from './fass-module';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: FassServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.FassValidator;
    const checks: ValidationChecks<FassAstType> = {
        Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class FassValidator {

    checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }

}
