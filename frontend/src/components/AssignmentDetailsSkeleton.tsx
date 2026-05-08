import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const AssignmentDetailsSkeleton = () => (
    <div className="container mx-auto p-4 md:p-8">
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Skeleton className="h-6 w-1/4 mb-2" />
                    <Skeleton className="h-20 w-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div>
                        <Skeleton className="h-5 w-1/3 mb-1" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                     <div>
                        <Skeleton className="h-5 w-1/3 mb-1" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                     <div>
                        <Skeleton className="h-5 w-1/3 mb-1" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
);
