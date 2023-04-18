"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFassServices = exports.FassModule = void 0;
const langium_1 = require("langium");
const module_1 = require("./generated/module");
const fass_validator_1 = require("./fass-validator");
/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
exports.FassModule = {
    validation: {
        FassValidator: () => new fass_validator_1.FassValidator()
    }
};
/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
function createFassServices(context) {
    const shared = (0, langium_1.inject)((0, langium_1.createDefaultSharedModule)(context), module_1.FassGeneratedSharedModule);
    const Fass = (0, langium_1.inject)((0, langium_1.createDefaultModule)({ shared }), module_1.FassGeneratedModule, exports.FassModule);
    shared.ServiceRegistry.register(Fass);
    (0, fass_validator_1.registerValidationChecks)(Fass);
    return { shared, Fass };
}
exports.createFassServices = createFassServices;
//# sourceMappingURL=fass-module.js.map