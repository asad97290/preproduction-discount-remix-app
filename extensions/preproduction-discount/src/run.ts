import type {
  RunInput,
  FunctionRunResult,
  ProductVariant,
  Target,
  Metafield,
} from "../generated/api";
import { DiscountApplicationStrategy } from "../generated/api";

const DEPOSIT_PERCENT = 50;
const ALLOWED_TIERS = ["bronze", "silver", "gold"];

export function run(input: RunInput): FunctionRunResult {
  const cart = input.cart;

  // Get customer metafield value
  const tier = cart.buyerIdentity?.customer?.metafield?.value?.toLowerCase();

  const isWholesale = tier && ALLOWED_TIERS.includes(tier);

  const discounts = cart.lines
    .filter((line) =>
      isWholesale &&
      line.merchandise.__typename === "ProductVariant" &&
      isPreproductionVariant(line.merchandise)
    )
    .map((line) => {
      const variant = line.merchandise as ProductVariant;

      const target: Target = {
        productVariant: {
          id: variant.id,
        },
      };

      return {
        targets: [target],
        value: {
          percentage: {
            value: DEPOSIT_PERCENT.toFixed(2),
          },
        },
        message: "50% Deposit - Pre-Production Item",
      };
    });

  return {
    discountApplicationStrategy: DiscountApplicationStrategy.First,
    discounts,
  };
}

function isPreproductionVariant(variant: ProductVariant): boolean {
  const metafield: Metafield | null | undefined = variant.metafield;
  return metafield?.value?.trim().length > 0;
}