import { Link } from '@tanstack/react-router'
import { BucketIndex } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft, ExternalLink, Search } from 'lucide-react'
import { ArnDisplay } from '@/components/ui/arn-display'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

type IndexesViewProps = {
  indexList: BucketIndex[];
  bucket: string;
  region: string | undefined;
};

export function IndexesView({ indexList, bucket, region }: IndexesViewProps) {
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
              <BreadcrumbLink className="font-medium">{bucket}</BreadcrumbLink>
            </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Button asChild variant="outline" size="sm">
            <Link to="/buckets" search={{ region }} className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Buckets
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <span>Indexes in {bucket}</span>
              <Badge className="ml-1">{indexList.length}</Badge>
            </h1>
            <p className="text-muted-foreground mt-1">Region: {region || 'us-east-1'}</p>
          </div>
        </div>

        <Separator />

        <div>
            {indexList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {indexList.map((index, i) => (
                  <Card key={i} className="overflow-hidden transition-all hover:shadow-md hover:border-primary/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{index.indexName}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <span>Bucket:</span>
                        <span className="font-medium">{index.vectorBucketName}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      <ArnDisplay arn={index.indexArn} />
                      <div className="flex justify-end">
                        <Button asChild size="sm" className="gap-1">
                          <Link
                            to="/vectors"
                            search={{ region: region || 'us-east-1', bucket, index: index.indexName }}
                          >
                            View Vectors
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-card shadow-sm">
                <Search className="h-12 w-12 text-muted-foreground/60 mb-3" />
                <h3 className="text-lg font-medium mb-1">No indexes found</h3>
                <p className="text-muted-foreground text-sm mb-4">This S3 bucket doesn't have any vector indexes.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
