import { Link } from '@tanstack/react-router'
import { Bucket } from '../types'
import { Button } from '@/components/ui/button'
import { RefreshCw, Database, ExternalLink } from 'lucide-react'
import { ArnDisplay } from '@/components/ui/arn-display'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// AWS regions with display names and region codes
const AWS_REGIONS = [
  { name: "US East (N. Virginia)", code: "us-east-1" },
  { name: "US East (Ohio)", code: "us-east-2" },
  { name: "US West (Oregon)", code: "us-west-2" },
  { name: "EU Central (Frankfurt)", code: "eu-central-1" },
  { name: "Asia Pacific (Sydney)", code: "ap-southeast-2" },
];

type BucketsViewProps = {
  bucketList: Bucket[];
  region: string;
  newRegion: string;
  onRegionChange: (value: string) => void;
  onRefresh: () => void;
};

export function BucketsView({
  bucketList,
  region,
  newRegion,
  onRegionChange,
  onRefresh
}: BucketsViewProps) {
  const columns: ColumnDef<Bucket>[] = [
    {
      accessorKey: "name",
      header: "Bucket Name",
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
      minSize: 150,
      size: 200,
      enableResizing: true,
    },
    {
      accessorKey: "arn",
      header: "ARN",
      cell: ({ row }) => <ArnDisplay arn={row.original.arn} />,
      minSize: 200,
      size: 300,
      enableResizing: true,
    },
    {
      id: "actions",
      enableResizing: true,
      minSize: 100,
      size: 150,
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right">
            <Button asChild variant="ghost" size="sm" className="h-8 gap-1">
              <Link
                to="/indexes"
                search={{ region: region || 'us-east-1', bucket: row.original.name }}
              >
                View Indexes
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Database className="h-6 w-6" />
              <span>S3 Vector Buckets</span>
              <Badge className="ml-1">{bucketList.length}</Badge>
            </h1>
            <p className="text-muted-foreground mt-1">Region: {region || 'us-east-1'}</p>
          </div>

          <div className="flex gap-2 items-center">
            <Select 
              value={newRegion}
              onValueChange={(value) => {
                onRegionChange(value);
                onRefresh(value); // Auto-refresh when region changes
              }}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select AWS Region" />
              </SelectTrigger>
              <SelectContent>
                {AWS_REGIONS.map((region) => (
                  <SelectItem key={region.code} value={region.code}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={()=>onRefresh(region)}
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <Separator />

        <div>
            {bucketList.length > 0 ? (
              <DataTable columns={columns} data={bucketList} pagination={bucketList.length > 10} enableResizing={true} columnBorders={true}/>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-card shadow-sm">
                <Database className="h-12 w-12 text-muted-foreground/60 mb-3" />
                <h3 className="text-lg font-medium mb-1">No buckets found</h3>
                <p className="text-muted-foreground text-sm mb-4">There are no S3 vector buckets available in this region.</p>
                <Button onClick={onRefresh} variant="outline" size="sm" className="gap-1">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}