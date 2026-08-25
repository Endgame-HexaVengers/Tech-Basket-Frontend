"use client";

import { Button, Spinner } from "@heroui/react";

interface ApprovalActionsProps {
  loadingReport: boolean;
  loadingReject: boolean;
  loadingApproval: boolean;
  onReport: () => void;
  onReject: () => void;
  onApproval: () => void;
}

export default function ApprovalActionsButton({
  loadingReport,
  loadingReject,
  loadingApproval,
  onReport,
  onReject,
  onApproval,
}: ApprovalActionsProps) {
  return (
    <div className="mt-6 flex items-center justify-center gap-5">
      
      <Button
        variant="outline"
        isDisabled={loadingReport}
        onPress={onReport}
        className="min-w-[120px] cursor-pointer rounded border-slate-300 bg-white font-medium text-slate-700 hover:bg-slate-50"
      >
        <span className="flex items-center gap-2">
          {loadingReport && <Spinner size="sm" />}
          {loadingReport ? "Reporting..." : "Report"}
        </span>
      </Button>

      <Button
        variant="outline"
        isDisabled={loadingReject}
        onPress={onReject}
        className="min-w-[120px] cursor-pointer rounded border-red-500 bg-white font-medium text-red-600 hover:bg-red-50"
      >
        <span className="flex items-center gap-2">
          {loadingReject && <Spinner size="sm" />}
          {loadingReject ? "Rejecting..." : "Reject"}
        </span>
      </Button>

      <Button
        isDisabled={loadingApproval}
        onPress={onApproval}
        className="min-w-[130px] cursor-pointer rounded bg-[#00175c] font-medium text-white hover:bg-[#000f3d]"
      >
        <span className="flex items-center gap-2">
          {loadingApproval && <Spinner size="sm" />}
          {loadingApproval ? "Approving..." : "Approval"}
        </span>
      </Button>
    </div>
  );
}