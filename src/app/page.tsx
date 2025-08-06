import AppHeader from '@/components/header';
import AiInsights from '@/components/ai-insights';
import CropSuggestion from '@/components/crop-suggestion';
import GovtSchemes from '@/components/govt-schemes';
import IrrigationPlan from '@/components/irrigation-plan';
import YieldPrediction from '@/components/yield-prediction';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChartBig,
  Droplets,
  Landmark,
  LineChart,
  Trees,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="container mx-auto flex-grow p-4 md:p-6 lg:p-8">
        <div className="mb-8 text-center print:hidden">
          <h2 className="mb-2 text-3xl font-bold text-primary/90 font-headline md:text-4xl">
            Comprehensive Farming Plan
          </h2>
          <p className="mx-auto max-w-3xl text-muted-foreground">
            Get personalized recommendations for your farm, from crop selection
            and irrigation schedules to government schemes, all powered by AI.
          </p>
        </div>

        <Tabs defaultValue="suggestions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 print:hidden sm:grid-cols-3 md:grid-cols-5">
            <TabsTrigger value="suggestions">
              <Trees className="mr-2 h-4 w-4" />
              Crop Suggestions
            </TabsTrigger>
            <TabsTrigger value="irrigation">
              <Droplets className="mr-2 h-4 w-4" />
              Irrigation Plan
            </TabsTrigger>
            <TabsTrigger value="yield">
              <LineChart className="mr-2 h-4 w-4" />
              Yield Prediction
            </TabsTrigger>
            <TabsTrigger value="schemes">
              <Landmark className="mr-2 h-4 w-4" />
              Govt. Schemes
            </TabsTrigger>
            <TabsTrigger value="insights">
              <BarChartBig className="mr-2 h-4 w-4" />
              Data Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="mt-6">
            <CropSuggestion />
          </TabsContent>
          <TabsContent value="irrigation" className="mt-6">
            <IrrigationPlan />
          </TabsContent>
          <TabsContent value="yield" className="mt-6">
            <YieldPrediction />
          </TabsContent>
          <TabsContent value="schemes" className="mt-6">
            <GovtSchemes />
          </TabsContent>
          <TabsContent value="insights" className="mt-6">
            <AiInsights />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="mt-12 border-t py-6 print:hidden">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} AgroGPT. Powered by AI for a
            greener tomorrow.
          </p>
        </div>
      </footer>
    </div>
  );
}
