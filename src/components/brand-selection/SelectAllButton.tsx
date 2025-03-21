
import { Button } from "@/components/ui/button";
import { X, CheckCheck } from "lucide-react";

interface SelectAllButtonProps {
  allVisibleSelected: boolean;
  someVisibleSelected: boolean;
  onClick: () => void;
}

const SelectAllButton = ({ 
  allVisibleSelected, 
  someVisibleSelected, 
  onClick 
}: SelectAllButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="text-sm"
    >
      {allVisibleSelected ? (
        <>
          <X className="h-4 w-4 mr-1" />
          Deselect all
        </>
      ) : (
        <>
          <CheckCheck className="h-4 w-4 mr-1" />
          {someVisibleSelected ? 'Select all visible' : 'Select all'}
        </>
      )}
    </Button>
  );
};

export default SelectAllButton;
