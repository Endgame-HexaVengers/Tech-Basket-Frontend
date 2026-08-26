import { Button } from "@heroui/react";
import FadeUp from "../FadeUp";

const UserPagination = () => {
    return (
        <FadeUp className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-700">
                    1 to 3
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-700">
                    48
                </span>{" "}
                users
            </p>

            {/* Pagination */}
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    isDisabled
                    className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-400 disabled:cursor-not-allowed"
                >
                    Prev
                </Button>

                <button
                    type="button"
                    className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white"
                >
                    1
                </button>

                <button
                    type="button"
                    className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                >
                    2
                </button>

                <button
                    type="button"
                    className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                >
                    3
                </button>

                <span className="px-1 text-gray-400">...</span>

                <Button
                    type="button"
                    className="rounded-md border bg-white border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                >
                    Next
                </Button>
            </div>

        </FadeUp>
    );
};

export default UserPagination;