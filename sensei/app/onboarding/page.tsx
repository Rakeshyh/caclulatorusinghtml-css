'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { completeOnboarding } from './actions'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const onboardingSchema = z.object({
  industry: z.string().min(1, 'Industry is required'),
  subIndustry: z.string().min(1, 'Sub-industry is required'),
  yearsExperience: z.number().min(0, 'Years of experience must be 0 or greater'),
  skills: z.string().min(1, 'At least one skill is required'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
})

type OnboardingFormData = z.infer<typeof onboardingSchema>

const industries = [
  { name: 'Technology', subcategories: ['Software Development', 'Data Science', 'Cybersecurity', 'Cloud Computing', 'AI/ML'] },
  { name: 'Healthcare', subcategories: ['Nursing', 'Medical Research', 'Healthcare Administration', 'Pharmacy', 'Medical Technology'] },
  { name: 'Finance', subcategories: ['Investment Banking', 'Financial Analysis', 'Accounting', 'Risk Management', 'Fintech'] },
  { name: 'Marketing', subcategories: ['Digital Marketing', 'Content Marketing', 'Brand Management', 'SEO/SEM', 'Social Media'] },
  { name: 'Education', subcategories: ['Teaching', 'Educational Technology', 'Curriculum Development', 'Administration', 'Online Learning'] },
  { name: 'Engineering', subcategories: ['Mechanical', 'Electrical', 'Civil', 'Chemical', 'Aerospace'] },
]

export default function OnboardingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedIndustry, setSelectedIndustry] = useState<string>('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
  })

  const industry = watch('industry')
  const subIndustry = watch('subIndustry')

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true)
    try {
      const skillsArray = data.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
      
      await completeOnboarding({
        ...data,
        skills: skillsArray,
      })
      
      toast.success('Profile completed successfully!')
    } catch (error) {
      console.error('Onboarding error:', error)
      toast.error('Failed to complete onboarding. Please try again.')
      setIsSubmitting(false)
    }
  }

  const selectedIndustryData = industries.find(i => i.name === industry)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Welcome to Sensei! 🎓</CardTitle>
          <CardDescription>
            Let's set up your profile to provide personalized career coaching
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Select
                value={industry}
                onValueChange={(value) => {
                  setValue('industry', value)
                  setValue('subIndustry', '')
                  setSelectedIndustry(value)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind.name} value={ind.name}>
                      {ind.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-red-500">{errors.industry.message}</p>
              )}
            </div>

            {selectedIndustryData && (
              <div className="space-y-2">
                <Label htmlFor="subIndustry">Specialization *</Label>
                <Select
                  value={subIndustry}
                  onValueChange={(value) => setValue('subIndustry', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedIndustryData.subcategories.map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-sm text-red-500">{errors.subIndustry.message}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="yearsExperience">Years of Experience *</Label>
              <Input
                id="yearsExperience"
                type="number"
                min="0"
                placeholder="e.g., 3"
                {...register('yearsExperience', { valueAsNumber: true })}
              />
              {errors.yearsExperience && (
                <p className="text-sm text-red-500">{errors.yearsExperience.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma-separated) *</Label>
              <Input
                id="skills"
                placeholder="e.g., JavaScript, React, Node.js, Python"
                {...register('skills')}
              />
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio *</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your professional background, goals, and what you're looking to achieve..."
                rows={5}
                {...register('bio')}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completing Setup...
                </>
              ) : (
                'Complete Setup'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
