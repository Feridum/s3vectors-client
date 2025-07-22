import { Link } from '@tanstack/react-router'
import { VectorData } from '../types'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileCode, Eye } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink, BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

type VectorsViewProps = {
  vectorsList: VectorData[];
  bucket: string;
  index: string;
  region: string;
};

export function VectorsView({ vectorsList, bucket, index, region }: VectorsViewProps) {
  const columns: ColumnDef<VectorData>[] = [
    {
      accessorKey: "key",
      header: "Vector Key",
      cell: ({ row }) => <div className="font-medium">{row.original.key}</div>,
      minSize: 150,
      size: 250,
      enableResizing: true,
    },
    {
      accessorKey: "data",
      header: "Dimensions",
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono">
          {row.original.data.length}
        </Badge>
      ),
      minSize: 100,
      size: 150,
      enableResizing: true,
    },
    {
      accessorKey: "metadata",
      header: "Metadata",
      size: 250,
      enableResizing: false,
      cell: ({ row, table }) => {
        // Access the toggle function from table meta
        const { toggleRowExpanded, expandedRows } = table.options.meta as any;

        return row.original.metadata ? (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2"
            onClick={(e) => toggleRowExpanded(row.id, e)}
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            {expandedRows?.[row.id] ? 'Hide' : 'View'}
          </Button>
        ) : (
          <span className="text-muted-foreground text-xs">None</span>
        );
      },
    },
  ];
  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/buckets" search={{ region }}>Buckets</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/indexes" search={{ region, bucket }}>{bucket}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="font-medium">{index}</BreadcrumbLink>
            </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Button asChild variant="outline" size="sm">
            <Link to="/indexes" search={{ region, bucket }} className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Indexes
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <span>Vectors in {index}</span>
              <Badge className="ml-1">{vectorsList.length}</Badge>
            </h1>
            <p className="text-muted-foreground mt-1">Region: {region || 'us-east-1'}</p>
          </div>
        </div>

        <Separator />

        <div>
            {vectorsList.length > 0 ? (
              <DataTable 
                columns={columns} 
                data={vectorsList} 
                pagination={vectorsList.length > 10} 
                enableResizing={true} 
                columnBorders={true} 
                renderExpandedRow={(rowData) => (
                  rowData.metadata ? (
                    <div>
                      <h3>Embedding</h3>
                      <div className="rounded-md bg-muted p-3 font-mono text-xs overflow-auto max-h-80 mb-8">
                        <pre>{JSON.stringify(rowData.data, null, 2)}</pre>
                      </div>
                      <h3 className="text-sm font-medium mb-2">Metadata for {rowData.key}</h3>
                      <div className="rounded-md bg-muted p-3 font-mono text-xs overflow-auto max-h-80">
                        <pre>{JSON.stringify(rowData.metadata, null, 2)}</pre>
                      </div>
                    </div>
                  ) : null
                )}
              />
            ) : (
                <div className="flex flex-col items-center justify-center py-10 border rounded-lg bg-card shadow-sm">
                  <FileCode className="h-12 w-12 text-muted-foreground/60 mb-3" />
                  <h3 className="text-lg font-medium">No vectors found</h3>
                <p className="text-muted-foreground text-sm mt-1">This index is empty</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
