import { IconType } from "react-icons";

interface TripDetailsItemProps {
  description: string;
  details?: string;
  Icon: IconType;
  editBtn?: boolean;
}

export default function TripDetailsCellItem({
  description,
  Icon,
  details,
  editBtn = false,
}: TripDetailsItemProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0`}
    >
      {/* Left side: Icon + text */}
      <div className="flex gap-3 sm:gap-[18px]">
        <Icon color="#BB9F64" size={22} className="sm:size-[24px] shrink-0" />
        <div className="min-w-0">
          <p className="font-medium whitespace-pre-line text-base sm:text-lg break-words leading-snug">
            {description}
          </p>
          {details && (
            <p className="text-sm sm:text-base font-medium text-[#A0A0A0] mt-0.5">
              {details}
            </p>
          )}
        </div>
      </div>

      {/* Right side: Edit button */}
      {editBtn && (
        <div className="text-[#093B77] cursor-pointer underline font-normal text-sm sm:text-base mt-1 sm:mt-0 self-end sm:self-auto">
          Edit
        </div>
      )}
    </div>
  );
}
