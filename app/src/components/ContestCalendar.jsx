import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ExternalLink } from "lucide-react";

const ContestCalendar = () => {
  const calendarSrc =
    "https://calendar.google.com/calendar/embed?src=k23j233gtcvau7a8ulk2p360m4%40group.calendar.google.com&src=efcajlnqvdqjeoud2spsiphnqk%40group.calendar.google.com&color=%237986CB&color=%23B39DDB&ctz=Asia%2FCalcutta&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=1&showTz=1";

  const additionalContests = [
    {
      name: "LeetCode Contests",
      description: "Weekly and Biweekly coding contests.",
      actionText: "Subscribe to iCal",
      link: "https://lccal-worker.bamboo.workers.dev/ical",
      isIcal: true,
    },
    {
      name: "CodeChef Contests",
      description: "Long and short challenges.",
      actionText: "View Schedule",
      link: "https://www.codechef.com/event-calendar",
      isIcal: false,
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 w-full h-[calc(100vh-4rem)]">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Contest Calendar</h1>
        <p className="text-muted-foreground">
          Track upcoming competitive programming contests from major platforms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        
        <Card className="lg:col-span-3 h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendar
            </CardTitle>
            <CardDescription>
              Includes events from Codeforces and AtCoder
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden relative min-h-[500px]">
            <iframe
              src={calendarSrc}
              style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg)" }}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              title="Contest Calendar"
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </CardContent>
        </Card>


        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Other Platforms</h2>
          {additionalContests.map((contest) => (
            <Card key={contest.name}>
              <CardHeader>
                <CardTitle className="text-lg">{contest.name}</CardTitle>
                <CardDescription>{contest.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <a
                    href={contest.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {contest.actionText}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                {contest.isIcal && (
                  <p className="text-xs text-muted-foreground mt-2">
                    * This is an iCal link. You can add it to your personal
                    calendar app.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestCalendar;
