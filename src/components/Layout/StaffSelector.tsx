import { useRestaurant } from "@/hooks/useRestaurant";
import { mockStaff } from "@/data/mockStaff";
import { User, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function StaffSelector() {
  const { currentStaff, setCurrentStaff } = useRestaurant();

  const activeStaff = mockStaff.filter((staff) => staff.active);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='flex items-center gap-2'>
          <User className='w-5 h-5' />
          <div className='flex flex-col items-start'>
            <span className='text-sm font-medium'>
              {currentStaff ? currentStaff.name : "Select Staff"}
            </span>
          </div>
          <ChevronDown className='w-4 h-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-64'>
        <DropdownMenuLabel>Select Staff Member</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {activeStaff.map((staff) => (
          <DropdownMenuItem
            key={staff.id}
            onClick={() => setCurrentStaff(staff)}
            className='flex items-center gap-3 cursor-pointer'
          >
            <div className='w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center'>
              <User className='w-5 h-5 text-primary-600' />
            </div>
            <div className='flex-1'>
              <div className='text-sm font-medium'>{staff.name}</div>
              <div className='text-xs text-muted-foreground capitalize'>
                {staff.role} • {staff.employeeId}
              </div>
            </div>
            {currentStaff?.id === staff.id && <Check className='w-4 h-4 text-primary-600' />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
