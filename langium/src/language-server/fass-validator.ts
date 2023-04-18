import { ValidationChecks } from 'langium';
import { FassAstType } from './generated/ast';
import type { FassServices } from './fass-module';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: FassServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.FassValidator;
    const checks: ValidationChecks<FassAstType> = {};
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class FassValidator {
}
