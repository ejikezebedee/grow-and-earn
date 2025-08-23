import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const campaignSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  tracking_url: z.string().url('Must be a valid URL'),
  commission_type: z.enum(['CPC', 'CPA', 'Revenue Share']),
  commission_value: z.number().min(0.01, 'Commission must be greater than 0'),
  banner_url: z.string().optional()
});

type CampaignForm = z.infer<typeof campaignSchema>;

export const CreateCampaign = () => {
  const [bannerUrl, setBannerUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<CampaignForm>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: '',
      description: '',
      tracking_url: '',
      commission_type: 'CPA',
      commission_value: 0,
      banner_url: ''
    }
  });

  const commissionType = form.watch('commission_type');

  const onSubmit = async (data: CampaignForm) => {
    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from('campaigns')
        .insert({
          title: data.title,
          description: data.description,
          tracking_url: data.tracking_url,
          commission_type: data.commission_type,
          commission_value: data.commission_value,
          banner_url: bannerUrl || null,
          advertiser_id: user?.id,
          status: 'pending' // Requires admin approval
        });

      if (error) throw error;

      toast({
        title: "Campaign Created!",
        description: "Your campaign has been submitted for review and will be active once approved by our team.",
      });

      navigate('/dashboard/advertiser/campaigns');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCommissionLabel = () => {
    switch (commissionType) {
      case 'CPC':
        return 'Amount per click ($)';
      case 'CPA':
        return 'Amount per action ($)';
      case 'Revenue Share':
        return 'Percentage of revenue (%)';
      default:
        return 'Commission value';
    }
  };

  const getCommissionDescription = () => {
    switch (commissionType) {
      case 'CPC':
        return 'Affiliates earn this amount for each click on their referral link';
      case 'CPA':
        return 'Affiliates earn this amount when someone completes the desired action';
      case 'Revenue Share':
        return 'Affiliates earn this percentage of the revenue generated';
      default:
        return '';
    }
  };

  // Preview data for the campaign card
  const previewData = {
    title: form.watch('title') || 'Campaign Title',
    description: form.watch('description') || 'Campaign description will appear here...',
    commission_type: commissionType,
    commission_value: form.watch('commission_value') || 0,
    banner_url: bannerUrl
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/dashboard/advertiser/campaigns">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Campaign</h1>
          <p className="text-muted-foreground">
            Set up a new affiliate marketing campaign
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>
              Fill in the details for your affiliate marketing campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter campaign title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your campaign and what affiliates will be promoting..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tracking_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tracking URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/landing-page"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        The URL where referral traffic will be sent
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="commission_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Commission Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CPC">CPC (Cost Per Click)</SelectItem>
                            <SelectItem value="CPA">CPA (Cost Per Action)</SelectItem>
                            <SelectItem value="Revenue Share">Revenue Share</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="commission_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{getCommissionLabel()}</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          {getCommissionDescription()}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Campaign Banner (Optional)
                  </label>
                  <div className="mt-2">
                    <FileUpload
                      bucket="campaign-banners"
                      path="campaigns"
                      onFileUploaded={setBannerUrl}
                      accept="image/*"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommended size: 400x200px. Max file size: 5MB
                  </p>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Creating Campaign...' : 'Create Campaign'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <CardTitle>Preview</CardTitle>
            </div>
            <CardDescription>
              How your campaign will appear to affiliates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">{previewData.title}</h3>
                  <div className="text-xs bg-muted px-2 py-1 rounded w-fit">
                    {previewData.commission_type}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-success">
                    <span className="text-lg font-bold">
                      {previewData.commission_type === 'Revenue Share' 
                        ? `${previewData.commission_value}%`
                        : `$${previewData.commission_value}`
                      }
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">per {previewData.commission_type}</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-3">
                {previewData.description}
              </p>

              {previewData.banner_url && (
                <div className="rounded overflow-hidden">
                  <img 
                    src={previewData.banner_url} 
                    alt="Campaign banner"
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}

              <Button variant="outline" className="w-full" disabled>
                Join Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};