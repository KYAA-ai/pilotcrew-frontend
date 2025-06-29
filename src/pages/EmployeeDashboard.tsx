import { Button } from "@/components/ui/button";
import { EmployeeLayout } from "@/components/layout/EmployeeLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Briefcase, Bookmark, TrendingUp } from "@/components/SimpleIcons";

export default function EmployeeDashboard() {
  return (
    <EmployeeLayout>
      <div className="flex flex-col gap-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back! 🎉</h1>
            <p className="text-muted-foreground">
              Find your next opportunity and grow your career
            </p>
          </div>
          <Button size="lg">
            <Search className="mr-2 h-4 w-4" />
            Search Jobs
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
              <Bookmark className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                +1 from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest job applications and profile activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Application submitted</p>
                    <p className="text-xs text-muted-foreground">Senior Software Engineer at TechCorp</p>
                  </div>
                </div>
                <Badge variant="secondary">2 hours ago</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Profile viewed</p>
                    <p className="text-xs text-muted-foreground">Your profile was viewed by a recruiter</p>
                  </div>
                </div>
                <Badge variant="secondary">1 day ago</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Job saved</p>
                    <p className="text-xs text-muted-foreground">Product Manager at StartupXYZ</p>
                  </div>
                </div>
                <Badge variant="secondary">3 days ago</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to help you get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <Search className="h-6 w-6 mb-2" />
                <span>Search Jobs</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Briefcase className="h-6 w-6 mb-2" />
                <span>My Applications</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Bookmark className="h-6 w-6 mb-2" />
                <span>Saved Jobs</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <TrendingUp className="h-6 w-6 mb-2" />
                <span>Profile Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
} 