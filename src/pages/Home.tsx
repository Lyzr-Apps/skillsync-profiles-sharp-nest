import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { callAIAgent, NormalizedAgentResponse } from '@/utils/aiAgent'
import {
  Search, Github, Code, Users, GitBranch, MessageSquare,
  Clock, Star, TrendingUp, Lightbulb, Target, Loader2,
  ArrowLeft, ExternalLink, Calendar, Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Agent ID from orchestrator
const AGENT_ID = "6966b2f01f8ceefab631347f"

// TypeScript interfaces matching ACTUAL response schema from test results
interface TechnicalSkills {
  primary_languages: string[]
  frameworks_tools: string[]
  domain_expertise: string[]
  proficiency_level: string
}

interface ProblemSolving {
  approach: string
  strengths: string[]
  code_quality_indicators: string[]
}

interface CollaborationStyle {
  communication_quality: string
  team_interaction: string
  review_participation: string
}

interface WorkingPatterns {
  commit_frequency: string
  consistency: string
  focus_areas: string[]
}

interface Recommendations {
  ideal_projects: string[]
  team_fit: string
  growth_opportunities: string[]
}

interface ProfileResult {
  developer_summary: string
  technical_skills: TechnicalSkills
  problem_solving: ProblemSolving
  collaboration_style: CollaborationStyle
  working_patterns: WorkingPatterns
  unique_insights: string[]
  recommendations: Recommendations
}

interface ProfileMetadata {
  agent_name: string
  timestamp: string
  repositories_analyzed: number
  data_points_collected: number
}

interface ProfileResponse extends NormalizedAgentResponse {
  result: ProfileResult & Record<string, any>
  metadata?: ProfileMetadata
}

// Sample profiles for showcase
const sampleProfiles = [
  { username: 'torvalds', name: 'Linus Torvalds', skill: 'Kernel Development' },
  { username: 'gvanrossum', name: 'Guido van Rossum', skill: 'Python Core' },
  { username: 'tj', name: 'TJ Holowaychuk', skill: 'Full Stack' },
]

// Loading states for progress indicator
const loadingSteps = [
  'Fetching GitHub profile...',
  'Analyzing repositories...',
  'Processing contributions...',
  'Evaluating code patterns...',
  'Building developer profile...',
]

// Profile Header Component
function ProfileHeader({ profile }: { profile: ProfileResult }) {
  return (
    <div className="flex items-start gap-6 mb-8">
      <div className="w-24 h-24 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20">
        <Github className="w-12 h-12 text-white" />
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">Developer Profile</h1>
        <p className="text-gray-200 text-lg leading-relaxed">
          {profile.developer_summary || 'Analyzing developer profile...'}
        </p>
      </div>
    </div>
  )
}

// Quick Stats Sidebar Component
function QuickStatsSidebar({ profile, metadata }: { profile: ProfileResult; metadata?: ProfileMetadata }) {
  return (
    <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-purple-500/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm text-gray-400 mb-1">Repositories Analyzed</div>
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {metadata?.repositories_analyzed || 0}
          </div>
        </div>

        <Separator className="bg-gradient-to-r from-purple-500/20 via-purple-500/50 to-purple-500/20" />

        <div>
          <div className="text-sm text-gray-400 mb-2">Primary Languages</div>
          <div className="flex flex-wrap gap-2">
            {profile.technical_skills.primary_languages.length > 0 ? (
              profile.technical_skills.primary_languages.map((lang, i) => (
                <Badge key={i} variant="secondary" className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-purple-200 border-purple-400/40">
                  {lang}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-500">No data available</span>
            )}
          </div>
        </div>

        <Separator className="bg-gradient-to-r from-purple-500/20 via-purple-500/50 to-purple-500/20" />

        <div>
          <div className="text-sm text-gray-400 mb-2">Domain Expertise</div>
          <div className="space-y-2">
            {profile.technical_skills.domain_expertise.length > 0 ? (
              profile.technical_skills.domain_expertise.map((domain, i) => (
                <div key={i} className="text-sm text-gray-200">
                  {domain}
                </div>
              ))
            ) : (
              <span className="text-sm text-gray-500">No data available</span>
            )}
          </div>
        </div>

        <Separator className="bg-gradient-to-r from-purple-500/20 via-purple-500/50 to-purple-500/20" />

        <div>
          <div className="text-sm text-gray-400 mb-1">Activity Pattern</div>
          <div className="text-sm text-gray-200">
            {profile.working_patterns.commit_frequency || 'No data'}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {profile.working_patterns.consistency || ''}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Skills Breakdown Card Component
function SkillsBreakdown({ skills }: { skills: TechnicalSkills }) {
  return (
    <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-blue-500/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Code className="w-5 h-5 text-blue-400" />
          Technical Skills Breakdown
        </CardTitle>
        {skills.proficiency_level && (
          <CardDescription className="text-gray-300">
            Proficiency Level: <span className="text-blue-400 font-semibold">{skills.proficiency_level}</span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-200 mb-3">Primary Languages</h4>
          <div className="flex flex-wrap gap-2">
            {skills.primary_languages.length > 0 ? (
              skills.primary_languages.map((lang, i) => (
                <Badge key={i} className="bg-gradient-to-r from-blue-600/30 to-cyan-600/30 text-blue-200 border-blue-400/40">
                  {lang}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-500">No languages identified</span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-200 mb-3">Frameworks & Tools</h4>
          <div className="flex flex-wrap gap-2">
            {skills.frameworks_tools.length > 0 ? (
              skills.frameworks_tools.map((tool, i) => (
                <Badge key={i} variant="outline" className="text-gray-200 border-gray-500 hover:border-blue-400/50 transition-colors">
                  {tool}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-500">No frameworks identified</span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-200 mb-3">Domain Expertise</h4>
          <div className="space-y-3">
            {skills.domain_expertise.length > 0 ? (
              skills.domain_expertise.map((domain, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="text-sm text-gray-200 mb-1.5">{domain}</div>
                    <Progress value={75} className="h-2 bg-gray-700/50 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-blue-500" />
                  </div>
                </div>
              ))
            ) : (
              <span className="text-sm text-gray-500">No domain expertise identified</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Working Style Insights Component
function WorkingStyleInsights({ problemSolving, collaboration, workingPatterns }: {
  problemSolving: ProblemSolving
  collaboration: CollaborationStyle
  workingPatterns: WorkingPatterns
}) {
  return (
    <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-purple-500/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          Working Style & Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Problem-Solving Approach
          </h4>
          <p className="text-gray-200 text-sm mb-3">
            {problemSolving.approach || 'No approach data available'}
          </p>
          {problemSolving.strengths.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs text-gray-400 mb-1">Key Strengths:</div>
              {problemSolving.strengths.map((strength, i) => (
                <div key={i} className="text-sm text-gray-200 flex items-start gap-2">
                  <Star className="w-3 h-3 text-yellow-400 mt-1 flex-shrink-0" />
                  <span>{strength}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator className="bg-gradient-to-r from-purple-500/20 via-purple-500/50 to-purple-500/20" />

        <div>
          <h4 className="text-sm font-semibold text-blue-300 mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Collaboration Style
          </h4>
          <div className="space-y-2">
            {collaboration.communication_quality && (
              <div>
                <span className="text-xs text-gray-400">Communication: </span>
                <span className="text-sm text-gray-200">{collaboration.communication_quality}</span>
              </div>
            )}
            {collaboration.team_interaction && (
              <div>
                <span className="text-xs text-gray-400">Team Interaction: </span>
                <span className="text-sm text-gray-200">{collaboration.team_interaction}</span>
              </div>
            )}
            {collaboration.review_participation && (
              <div>
                <span className="text-xs text-gray-400">Code Reviews: </span>
                <span className="text-sm text-gray-200">{collaboration.review_participation}</span>
              </div>
            )}
            {!collaboration.communication_quality && !collaboration.team_interaction && !collaboration.review_participation && (
              <span className="text-sm text-gray-500">No collaboration data available</span>
            )}
          </div>
        </div>

        <Separator className="bg-gradient-to-r from-purple-500/20 via-purple-500/50 to-purple-500/20" />

        <div>
          <h4 className="text-sm font-semibold text-emerald-300 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Working Patterns
          </h4>
          <div className="space-y-2">
            {workingPatterns.focus_areas.length > 0 && (
              <div>
                <div className="text-xs text-gray-400 mb-1">Focus Areas:</div>
                {workingPatterns.focus_areas.map((area, i) => (
                  <Badge key={i} variant="outline" className="text-emerald-300 border-emerald-500/40 mr-2 mb-2 hover:border-emerald-400 transition-colors">
                    {area}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {problemSolving.code_quality_indicators.length > 0 && (
          <>
            <Separator className="bg-gradient-to-r from-purple-500/20 via-purple-500/50 to-purple-500/20" />
            <div>
              <h4 className="text-sm font-semibold text-orange-300 mb-2">Code Quality Indicators</h4>
              <div className="space-y-1">
                {problemSolving.code_quality_indicators.map((indicator, i) => (
                  <div key={i} className="text-sm text-gray-200">• {indicator}</div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// Unique Insights Component
function UniqueInsights({ insights }: { insights: string[] }) {
  if (!insights || insights.length === 0) return null

  return (
    <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-emerald-500/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          Notable Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-900/60 to-gray-800/40 rounded-lg border border-purple-500/20 hover:border-purple-400/40 transition-colors">
              <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-gray-200 text-sm leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Recommendations Component
function RecommendationsSection({ recommendations }: { recommendations: Recommendations }) {
  const hasData = recommendations.ideal_projects.length > 0 ||
                  recommendations.team_fit ||
                  recommendations.growth_opportunities.length > 0

  if (!hasData) return null

  return (
    <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-purple-500/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {recommendations.ideal_projects.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-purple-300 mb-2">Ideal Projects</h4>
            <div className="space-y-2">
              {recommendations.ideal_projects.map((project, i) => (
                <div key={i} className="text-sm text-gray-200 flex items-start gap-2">
                  <GitBranch className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>{project}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendations.team_fit && (
          <>
            {recommendations.ideal_projects.length > 0 && <Separator className="bg-gradient-to-r from-purple-500/20 via-purple-500/50 to-purple-500/20" />}
            <div>
              <h4 className="text-sm font-semibold text-blue-300 mb-2">Team Fit</h4>
              <p className="text-sm text-gray-200">{recommendations.team_fit}</p>
            </div>
          </>
        )}

        {recommendations.growth_opportunities.length > 0 && (
          <>
            <Separator className="bg-gradient-to-r from-purple-500/20 via-purple-500/50 to-purple-500/20" />
            <div>
              <h4 className="text-sm font-semibold text-emerald-300 mb-2">Growth Opportunities</h4>
              <div className="space-y-2">
                {recommendations.growth_opportunities.map((opportunity, i) => (
                  <div key={i} className="text-sm text-gray-200 flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{opportunity}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// Loading Indicator Component
function LoadingIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-purple-500/30 backdrop-blur-sm shadow-xl shadow-purple-500/10">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin relative z-10" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Analyzing GitHub Profile
              </h3>
              <p className="text-gray-300 text-sm">
                {loadingSteps[currentStep] || 'Processing...'}
              </p>
            </div>
            <div className="w-full space-y-2">
              {loadingSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    i < currentStep ? "bg-emerald-400 shadow-sm shadow-emerald-400/50" :
                    i === currentStep ? "bg-purple-400 animate-pulse shadow-sm shadow-purple-400/50" :
                    "bg-gray-600"
                  )} />
                  <span className={cn(
                    "text-sm",
                    i <= currentStep ? "text-gray-200" : "text-gray-500"
                  )}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main Home Component
export default function Home() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null)
  const [showResults, setShowResults] = useState(false)

  const analyzeProfile = async () => {
    if (!username.trim()) {
      setError('Please enter a GitHub username')
      return
    }

    setLoading(true)
    setError(null)
    setCurrentStep(0)

    // Simulate progress steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev))
    }, 1500)

    try {
      const result = await callAIAgent(username.trim(), AGENT_ID)

      clearInterval(stepInterval)

      if (result.success) {
        setProfileData(result.response as ProfileResponse)
        setShowResults(true)
      } else {
        setError(result.error || 'Failed to analyze profile')
      }
    } catch (err) {
      clearInterval(stepInterval)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
      setCurrentStep(0)
    }
  }

  const handleSampleProfile = (sampleUsername: string) => {
    setUsername(sampleUsername)
    setTimeout(() => analyzeProfile(), 100)
  }

  const resetToSearch = () => {
    setShowResults(false)
    setProfileData(null)
    setUsername('')
    setError(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      analyzeProfile()
    }
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/40 to-blue-950/30 p-6 flex items-center justify-center">
        <LoadingIndicator currentStep={currentStep} />
      </div>
    )
  }

  // Results View
  if (showResults && profileData) {
    const profile = profileData.result as ProfileResult

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/40 to-blue-950/30">
        <div className="container mx-auto px-6 py-8">
          {/* Header with back button */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={resetToSearch}
              className="text-gray-300 hover:text-white hover:bg-purple-500/10 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Analyze Another Profile
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Quick Stats */}
            <div className="lg:col-span-1">
              <QuickStatsSidebar profile={profile} metadata={profileData.metadata} />
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Profile Header */}
              <ProfileHeader profile={profile} />

              {/* Error handling */}
              {profileData.status === 'error' && (
                <Card className="bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-500/40 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-red-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-red-300 text-xl">!</span>
                      </div>
                      <div>
                        <h3 className="text-red-300 font-semibold mb-1">Analysis Error</h3>
                        <p className="text-gray-200 text-sm">
                          {profileData.message || 'Unable to analyze profile'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Skills Breakdown */}
              <SkillsBreakdown skills={profile.technical_skills} />

              {/* Working Style Insights */}
              <WorkingStyleInsights
                problemSolving={profile.problem_solving}
                collaboration={profile.collaboration_style}
                workingPatterns={profile.working_patterns}
              />

              {/* Unique Insights */}
              <UniqueInsights insights={profile.unique_insights} />

              {/* Recommendations */}
              <RecommendationsSection recommendations={profile.recommendations} />

              {/* Metadata Footer */}
              {profileData.metadata && (
                <div className="text-center text-sm text-gray-400 pt-4">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span>
                      Analyzed on {new Date(profileData.metadata.timestamp).toLocaleDateString()}
                    </span>
                    <span className="text-purple-400">•</span>
                    <span>
                      {profileData.metadata.data_points_collected} data points collected
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Homepage/Search View
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/40 to-blue-950/30">
      <ScrollArea className="h-screen">
        <div className="container mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl blur-2xl opacity-30"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Github className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              SkillSync
            </h1>

            <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Empathize at Scale
            </p>

            <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
              Understand developers beyond their code. Analyze GitHub profiles to discover
              working styles, collaboration patterns, and technical strengths.
            </p>

            {/* Search Input */}
            <div className="max-w-2xl mx-auto mb-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter GitHub username (e.g., torvalds)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-12 h-14 text-lg bg-gray-800/60 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
                <Button
                  onClick={analyzeProfile}
                  disabled={loading || !username.trim()}
                  className="h-14 px-8 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 hover:from-purple-700 hover:via-purple-600 hover:to-blue-700 text-white font-semibold text-lg shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Analyze Profile
                </Button>
              </div>
              {error && (
                <p className="text-red-400 text-sm mt-2 text-left">{error}</p>
              )}
            </div>
          </div>

          {/* Sample Profiles Showcase */}
          <div className="max-w-5xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Try Sample Profiles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sampleProfiles.map((profile) => (
                <Card
                  key={profile.username}
                  className="bg-gray-800/60 border-purple-500/20 hover:border-purple-400/50 hover:bg-gray-800/80 transition-all cursor-pointer group backdrop-blur-sm"
                  onClick={() => handleSampleProfile(profile.username)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-full flex items-center justify-center group-hover:from-purple-500/40 group-hover:to-blue-500/40 transition-all">
                        <Github className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                          {profile.name}
                        </div>
                        <div className="text-sm text-gray-400">@{profile.username}</div>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-purple-200 border-purple-400/40">
                      {profile.skill}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How It Works Section */}
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600/30 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/10">
                  <Search className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  1. Enter Username
                </h3>
                <p className="text-gray-300 text-sm">
                  Simply provide a GitHub username to get started with the analysis
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600/30 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/10">
                  <Code className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  2. AI Analysis
                </h3>
                <p className="text-gray-300 text-sm">
                  Our AI analyzes repositories, commits, and collaboration patterns
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600/30 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/10">
                  <TrendingUp className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  3. Get Insights
                </h3>
                <p className="text-gray-300 text-sm">
                  Receive comprehensive insights about skills, style, and strengths
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-16 text-gray-400 text-sm">
            <p>Powered by AI Agent Technology</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
