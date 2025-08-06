import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const schemes = [
  {
    name: "PM-Kisan Samman Nidhi",
    eligibility: "All small and marginal farmer families.",
    benefits: "₹6,000 per year in three equal installments.",
    documents: "Aadhaar card, Bank account details, Land ownership documents.",
    application: "Apply through the official PM-Kisan portal or Common Service Centers (CSCs).",
  },
  {
    name: "Soil Health Card Scheme",
    eligibility: "All farmers are eligible to get a Soil Health Card for their land holdings.",
    benefits: "Provides a detailed report of soil nutrient status and recommendations on dosage of fertilizers.",
    documents: "Basic identity and land details.",
    application: "Contact the local agriculture office or soil testing lab.",
  },
  {
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    eligibility: "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.",
    benefits: "Provides insurance coverage and financial support to farmers in the event of failure of any of the notified crops.",
    documents: "Land records, Bank account details, Aadhaar card.",
    application: "Enroll through banks, CSCs, or the National Crop Insurance Portal.",
  },
];

export default function GovtSchemes() {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>4. Applicable Government Schemes</CardTitle>
                <CardDescription>Discover central government schemes that you might be eligible for.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {schemes.map((scheme) => (
                        <AccordionItem value={scheme.name} key={scheme.name}>
                            <AccordionTrigger className="text-base font-bold">{scheme.name}</AccordionTrigger>
                            <AccordionContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-primary">Eligibility</h4>
                                    <p className="text-muted-foreground">{scheme.eligibility}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-primary">Benefits</h4>
                                    <p className="text-muted-foreground">{scheme.benefits}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-primary">Documents Required</h4>
                                    <p className="text-muted-foreground">{scheme.documents}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-primary">How to Apply</h4>
                                    <p className="text-muted-foreground">{scheme.application}</p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}
