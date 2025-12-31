import { useState } from "react";
import { FileText } from "lucide-react";
import { useRestaurant } from "@/hooks/useRestaurant";
import type { Sale } from "@/types/index";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { StatCard } from "./StatCard";
import { SaleDetailsModal } from "./SaleDetailsModal";
import { mockStaff } from "@/data/mockStaff";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function SalesHistory() {
  const { sales } = useRestaurant();
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "refunded">("all");
  const [filterStaff, setFilterStaff] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.saleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.items.some((item) =>
        item.menuItemName.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStatus = filterStatus === "all" || sale.status === filterStatus;
    const matchesStaff = filterStaff === "all" || sale.staffId === filterStaff;

    return matchesSearch && matchesStatus && matchesStaff;
  });

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredSales.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedSales = filteredSales.slice(startIndex, endIndex);

  // Handle page size change
  const handlePageSizeChange = (newSize: string) => {
    setPageSize(Number(newSize));
    setCurrentPage(1);
  };

  // Calculate stats based on filtered sales
  const statsBaseSales =
    filterStaff === "all" ? sales : sales.filter((s) => s.staffId === filterStaff);

  const totalRevenue = statsBaseSales
    .filter((s) => s.status === "completed")
    .reduce((sum, sale) => sum + sale.total, 0);

  const todaySales = statsBaseSales.filter((sale) => {
    const saleDate = new Date(sale.createdAt);
    const today = new Date();
    return saleDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div className='h-[calc(100vh-88px)] bg-gray-50'>
      <div className='p-6'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
          <StatCard title='Total Orders' value={statsBaseSales.length} icon='chart' />
          <StatCard title='Total Revenue' value={formatCurrency(totalRevenue)} icon='cash' />
          <StatCard title="Today's Orders" value={todaySales.length} icon='calendar' />
          <StatCard title="Today's Revenue" value={formatCurrency(todayRevenue)} icon='trending' />
        </div>

        {/* Search and Filter */}
        <Card className='p-5 mb-4 bg-white rounded-md border-none'>
          <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-1 md:grid-cols-12 gap-4'>
              {/* Search - full width on mobile, 4 cols on desktop */}
              <div className='md:col-span-4'>
                <Input
                  type='text'
                  placeholder='Search by order number or menu item...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='h-11'
                />
              </div>

              {/* Status filters - full width on mobile, 5 cols on desktop */}
              <div className='md:col-span-5 flex items-center gap-3'>
                <span className='text-sm font-medium text-gray-600 whitespace-nowrap'>Status:</span>
                {(["all", "completed", "refunded"] as const).map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "default" : "outline"}
                    onClick={() => {
                      setFilterStatus(status);
                      handleFilterChange();
                    }}
                    className='capitalize'
                    size='sm'
                  >
                    {status}
                  </Button>
                ))}
              </div>

              {/* Staff selector - full width on mobile, 3 cols on desktop */}
              <div className='md:col-span-3 flex items-center gap-2'>
                <span className='text-sm font-medium text-gray-600 whitespace-nowrap'>Staff:</span>
                <Select
                  value={filterStaff}
                  onValueChange={(value) => {
                    setFilterStaff(value);
                    handleFilterChange();
                  }}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select staff' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Staff</SelectItem>
                    {mockStaff.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Sales List */}
        {filteredSales.length === 0 ? (
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center'>
            <FileText className='w-20 h-20 mx-auto text-gray-300 mb-4' />
            <p className='text-gray-500 font-semibold'>No orders found</p>
            <p className='text-sm text-gray-400 mt-1'>
              {searchQuery ? "Try adjusting your search" : "Start taking orders to see them here"}
            </p>
          </div>
        ) : (
          <>
            <Card className='overflow-hidden bg-white rounded-md shadow-none'>
              <Table>
                <TableHeader className='bg-gray-50'>
                  <TableRow>
                    <TableHead>Order Number</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className='text-right'>Total</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-center'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className='font-medium'>{sale.saleNumber}</TableCell>
                      <TableCell>
                        <div className='text-sm'>{sale.staffName}</div>
                        <div className='text-xs text-muted-foreground capitalize'>
                          {sale.staffRole}
                        </div>
                      </TableCell>
                      <TableCell>
                        {sale.items.length} {sale.items.length === 1 ? "item" : "items"}
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline' className='capitalize'>
                          {sale.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell className='font-bold text-right'>
                        {formatCurrency(sale.total)}
                      </TableCell>
                      <TableCell className='text-muted-foreground'>
                        {formatDate(sale.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            sale.status === "completed"
                              ? "success"
                              : sale.status === "refunded"
                              ? "destructive"
                              : "secondary"
                          }
                          className='capitalize'
                        >
                          {sale.status}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-center'>
                        <Button
                          variant='link'
                          onClick={() => setSelectedSale(sale)}
                          className='p-0 h-auto text-primary font-medium'
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <div className='flex items-center justify-between mt-4'>
              <span className='text-sm text-muted-foreground'>
                Showing {startIndex + 1} to {Math.min(endIndex, filteredSales.length)} of{" "}
                {filteredSales.length} results
              </span>

              <div className='flex items-center gap-8'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-muted-foreground'>Rows per page:</span>
                  <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
                    <SelectTrigger className='w-[70px]'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='5'>5</SelectItem>
                      <SelectItem value='10'>10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className='cursor-pointer'
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sale Details Modal */}
      {selectedSale && (
        <SaleDetailsModal sale={selectedSale} onClose={() => setSelectedSale(null)} />
      )}
    </div>
  );
}
