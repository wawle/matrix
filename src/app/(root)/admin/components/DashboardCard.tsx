import { DashboardButton } from './DashboardButton';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
      
export function DashboardCard() {
  return (
    <Card className={cn("", "p-4")}>
      <CardHeader>
        <CardTitle>Dashboard Card</CardTitle>
        
      </CardHeader>
      <CardContent>
        <DashboardButton/>

      </CardContent>
      
    </Card>
  )
}
