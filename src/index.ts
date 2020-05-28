import { VTAugment } from "./vt-augment"

const factory = VTAugment.factory
factory["default"] = VTAugment.factory

/* Export typescript types */
export {
    VTAugment,
    VTAugmentOptions
} from "./vt-augment"

/**
 * Return VTAugment instance.
 */
export default factory
