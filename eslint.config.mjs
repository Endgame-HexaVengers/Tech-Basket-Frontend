import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: [
      "src/app/api/**/*.ts",
      "src/app/(MainLayout)/(Pages)/sales/NewSaleEntry.tsx",
      "src/app/(MainLayout)/(Pages)/sales/return/SalesReturn.tsx",
      "src/components/PurchaseSection/PurchaseEntryClient.tsx",
      "src/components/PurchaseSection/ReturnInvoiceModal.tsx",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
