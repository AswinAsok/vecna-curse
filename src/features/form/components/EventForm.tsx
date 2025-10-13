import { Button } from "@/components";

import { useEventDataContext } from "../contexts/eventDataContext";
import { usePaginationContext } from "../contexts/paginationContext";
import styles from "../FormPage.module.css";
import { useFormSubmission } from "../hooks/useFormSubmission.hook";
import { useFormValidation } from "../hooks/useFormValidation.hook";
import { usePagination } from "../hooks/usePagination.hook";
import { doesFieldValidatesConditions } from "../utils";
import FormFieldsRenderer from "./FormFieldsRenderer";

const EventForm = ({ logId }: { logId: string | null }) => {
    const eventData = useEventDataContext();

    const { setFormData, formData, isSubmitting, handleSubmit } = useFormSubmission({ logId });

    const currentPage = usePaginationContext();

    const { totalPages, pageGroups } = usePagination();
    const { validateCurrentPage } = useFormValidation({
        currentFields: pageGroups[currentPage],
        formData,
    });

    const handleInputChange = (fieldKey: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [fieldKey]: value,
        }));
    };

    return (
        <div className={styles.form}>
            <div className={styles.fieldsContainer}>
                {pageGroups[currentPage]
                    .filter((field) => doesFieldValidatesConditions({ field, formData, eventData }))
                    .map((field) => (
                        <FormFieldsRenderer
                            key={field.id}
                            field={field}
                            value={formData[field.field_key] || ""}
                            handleInputChange={handleInputChange}
                        />
                    ))}
            </div>

            {currentPage === totalPages && (
                <Button
                    onClick={() => {
                        if (validateCurrentPage()) handleSubmit();
                    }}
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Stepping In..." : "Step Into the Lair →"}
                </Button>
            )}
        </div>
    );
};

export default EventForm;
