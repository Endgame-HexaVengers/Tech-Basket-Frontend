import { Button } from "@heroui/react";
import FadeUp from "../FadeUp";

interface UserPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const UserPagination = ({ currentPage, totalPages, onPageChange }: UserPaginationProps) => {
    return (
        <FadeUp className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    isDisabled={currentPage === 1}
                    onPress={() => onPageChange(currentPage - 1)}
                    className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-400 disabled:cursor-not-allowed"
                >
                    Prev
                </Button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                        key={page}
                        type="button"
                        onClick={() => onPageChange(page)}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                            page === currentPage
                                ? "bg-blue-600 text-white"
                                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        {page}
                    </button>
                ))}

                <Button
                    type="button"
                    isDisabled={currentPage === totalPages}
                    onPress={() => onPageChange(currentPage + 1)}
                    className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
                >
                    Next
                </Button>
            </div>

        </FadeUp>
    );
};

export default UserPagination;