
import React from 'react';

import {
  Card,
  Input,
  TextArea,
  Label,
} from '@heroui/react';

import { FiHash } from 'react-icons/fi';

interface Props {
  reference: string;
  remarks: string;

  onReferenceChange: (val: string) => void;
  onRemarksChange: (val: string) => void;
}

export const AdditionalDetails: React.FC<Props> = ({
  reference,
  remarks,
  onReferenceChange,
  onRemarksChange,
}) => {
  return (
    <Card className="p-4 shadow-sm border border-default-200">

      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Additional Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Reference */}
        <div className="flex flex-col gap-1.5">

          <Label>
            Reference (Optional)
          </Label>

          <div className="relative flex items-center">

            <FiHash className="absolute left-3 text-default-400 z-10" />

            <Input
              placeholder="Ref #"
              value={reference}
              className="pl-9"
              onChange={(e) =>
                onReferenceChange(e.target.value)
              }
            />

          </div>

        </div>

        {/* Remarks */}
        <div className="flex flex-col gap-1.5">

          <Label>
            Remarks
          </Label>

          <TextArea
            placeholder="Add any additional notes here..."
            value={remarks}
            rows={3}
            onChange={(e) =>
              onRemarksChange(e.target.value)
            }
          />

        </div>

      </div>

    </Card>
  );
};