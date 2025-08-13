import {
    Building,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    DotsVertical,
    MapPin,
    // Add a refresh icon if available, fallback to Loader
    Loader as RefreshIcon,
} from "@/components/SimpleIcons";
import {
    type ColumnDef,
} from "@tanstack/react-table";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
  
  import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";

  // Card component for displaying items
  function DataCard({ 
    item, 
    onAction,
    actions = [],
    navigationUrl
  }: { 
    item: Record<string, unknown>
    onAction?: (action: string, row: Record<string, unknown>) => void
    actions?: Array<{
      label: string
      value: string
      variant?: "default" | "destructive"
    }>
    navigationUrl?: string
  }) {
    const navigate = useNavigate();

    // Extract key information for the card
    const title = String(item.title || item.name || "Untitled")
    const description = String(item.description || item.summary || "")
    const company = String(item.companyName|| "")
    const location = String(item.location || item.city || "")
    const salary = (item.salary || item.compensation) as { min: number; max: number; currency: string } | string | number | null | undefined
    const type = String(item.type || item.jobType || "")
    const tags = Array.isArray(item.tags || item.skills || item.categories) 
      ? (item.tags || item.skills || item.categories) as string[] : []

    return (
      <Card
        className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-border/50 hover:border-border h-full flex flex-col cursor-pointer"
        onClick={() => {
          const id = item.id || item._id;
          if (id && navigationUrl) {
            const url = navigationUrl.replace('{id}', String(id));
            navigate(url);
          }
        }}
        tabIndex={0}
        role="button"
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold line-clamp-2">
                {title}
              </CardTitle>
              {company && (
                <div className="flex items-center gap-2 mt-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{company}</span>
                </div>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 group-hover:opacity-100 transition-opacity"
                  onClick={e => e.stopPropagation()}
                >
                  <DotsVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                {actions.map((action) => (
                  <DropdownMenuItem
                    key={action.value}
                    variant={action.variant}
                    onClick={e => { e.stopPropagation(); onAction?.(action.value, item); }}
                  >
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
                <CardContent className="space-y-3 flex-1">
          {description && (
            <CardDescription className="line-clamp-3 text-sm">
              {description}
            </CardDescription>
          )}
          <div className="space-y-2">
            {location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{location}</span>
              </div>
            )}
            {salary && (
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-xs">
                  {typeof salary === "object" && salary !== null 
                    ? `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`
                    : String(salary)
                  }
                </Badge>
              </div>
            )}
            {type && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {type}
                </Badge>
              </div>
            )}
          </div>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Loading skeleton for cards
  function CardSkeleton() {
    return (
      <Card className="border-border/50 h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-8 w-8" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-13" />
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-14" />
          </div>
        </CardContent>
        <CardFooter className="pt-3">
          <Skeleton className="h-9 w-full" />
        </CardFooter>
      </Card>
    )
  }

  interface GenericDataTableProps {
  endpoint: string
  dataKey: string
  title?: string
  enableDrag?: boolean
  enableSelection?: boolean
  customColumns?: ColumnDef<Record<string, unknown>>[]
  onRowAction?: (action: string, row: Record<string, unknown>) => void
  actions?: Array<{
    label: string
    value: string
    variant?: "default" | "destructive"
  }>
  customActionElement?: (refreshTable: () => void) => React.ReactNode
  searchBarElement?: React.ReactNode
  filterTagsElement?: React.ReactNode
  /**
   * Optional request body to send as POST. If provided, will POST to endpoint with this body; otherwise, GET.
   */
  requestBody?: Record<string, unknown>;
  /**
   * Navigation URL template. Use {id} as placeholder for the item ID.
   * Example: "/employee/jobs/{id}?mode=view"
   */
  navigationUrl?: string;
  /**
   * Number of items per page. Defaults to 12.
   */
  pageSize?: number;
}

  export function RecommendedJobsView({
  endpoint,
  dataKey,
  title = "Recommended Jobs",
  onRowAction,
  actions = [
    { label: "Edit", value: "edit" },
    { label: "Delete", value: "delete", variant: "destructive" }
  ],
  customActionElement,
  searchBarElement,
  filterTagsElement,
  requestBody,
  navigationUrl,
  pageSize = 12
}: GenericDataTableProps) {
  const [data, setData] = React.useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [currentPageSize, setCurrentPageSize] = React.useState(pageSize)
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalResults, setTotalResults] = React.useState(0)

    const fetchData = React.useCallback(async (page = 1, size = currentPageSize) => {
      try {
        setLoading(true)
        setError(null)
        let response;
        if (requestBody) {
          response = await api.post(`${endpoint}?page=${page}&limit=${size}`, requestBody as Record<string, unknown>);
        } else {
          response = await api.get(`${endpoint}?page=${page}&limit=${size}`);
        }
        const responseData = response.data

        // Extract data using the provided key
        const extractedData = responseData[dataKey] || responseData
        setData(Array.isArray(extractedData) ? extractedData : [])
        
        // Set pagination info if available
        if (responseData.pagination) {
          setCurrentPage(responseData.pagination.currentPage)
          setTotalPages(responseData.pagination.totalPages)
          setTotalResults(responseData.pagination.totalResults)
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to fetch data')
        toast.error('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }, [endpoint, dataKey, requestBody, currentPageSize])

    // Fetch data from endpoint
    React.useEffect(() => {
      fetchData()
    }, [fetchData])

    // Handle page changes
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
      fetchData(page, currentPageSize);
    };

    // Handle page size changes
    const handlePageSizeChange = (newPageSize: string) => {
      const size = parseInt(newPageSize);
      setCurrentPageSize(size);
      setCurrentPage(1); // Reset to first page when changing page size
      fetchData(1, size);
    };

    return (
      <div className="w-full flex-col justify-start gap-6">
        <div className="flex flex-col gap-4 px-4 sm:px-8 lg:px-16">
          {/* Mobile: Stack elements vertically */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {searchBarElement && (
              <div className="flex-1 w-full sm:max-w-3/4 sm:mr-4 order-1 sm:order-1">
                {searchBarElement}
              </div>
            )}
            <h2 className="text-xl sm:text-2xl font-bold order-2 sm:order-2">{title}</h2>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-2 order-3 sm:order-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchData(currentPage, currentPageSize)}
                title="Refresh"
                className="flex items-center gap-2 w-full sm:w-auto px-4 py-2"
              >
                <RefreshIcon className="size-4 animate-none" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              {customActionElement && (
                <div className="w-full sm:w-auto">
                  {customActionElement(fetchData)}
                </div>
              )}
            </div>
          </div>
        </div>
        {filterTagsElement && (
          <div className="px-4 sm:px-8 lg:px-16">
            {filterTagsElement}
          </div>
        )}
        <div className="px-4 sm:px-8 lg:px-16">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-8 text-destructive mt-6">
              <span>{error}</span>
            </div>
          ) : data.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-6">
                {data.map((item, index) => (
                  <DataCard
                    key={String(item._id || item.id || index)}
                    item={item}
                    onAction={onRowAction}
                    actions={actions}
                    navigationUrl={navigationUrl}
                  />
                ))}
              </div>
              {/* Page Size Selector - Always visible when there's data */}
              <div className="flex items-center justify-end mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Show:</span>
                  <Select value={currentPageSize.toString()} onValueChange={handlePageSizeChange}>
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8">
                  <div className="text-sm text-muted-foreground text-center sm:text-left">
                    Showing {data.length} of {totalResults} results
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from(Array(Math.min(5, totalPages)), (_, i) => {
                        const page = i + 1
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        )
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-muted-foreground mb-4 text-center">
                <Building className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-sm">Try adjusting your search criteria or refresh the page.</p>
              </div>
              <Button onClick={() => fetchData(currentPage, pageSize)} variant="outline">
                <RefreshIcon className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  } 