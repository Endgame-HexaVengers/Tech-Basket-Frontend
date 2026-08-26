import ApproveProductClient from "./ApproveProductClient";

type ApproveProductProps = {
  productName: string;
  onClose: () => void;
  onApprove: () => void;
};

export default function ApproveProduct(props: ApproveProductProps) {
  return <ApproveProductClient {...props} />;
}
