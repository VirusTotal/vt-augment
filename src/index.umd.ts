import { VTAugment } from "./vt-augment"

const factory = VTAugment.factory
factory["default"] = VTAugment.factory

/**
 * Return VTAugment instance.
 */
export default factory
