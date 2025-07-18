import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Save, Trash2, X, Search, ServerIcon } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { usePlexNotifications } from '@/features/utilities/hooks/usePlexNotifications'
import { usePlexServerDiscovery } from '@/features/utilities/hooks/usePlexServerDiscovery'
import { PlexNotificationsConfirmationModal } from '@/features/utilities/components/plex-notifications/plex-notifications-confirmation-modal'
import { PlexNotificationsSkeleton } from '@/features/utilities/components/plex-notifications/plex-notifications-skeleton'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

/**
 * Renders a form interface for configuring Plex notifications for all Radarr and Sonarr instances, including Plex server discovery and connection management.
 *
 * Users can enter Plex connection details, discover available Plex servers using a Plex token, select a server, and manage notification settings. The form provides real-time status feedback for each Radarr and Sonarr instance and supports removal of all Plex notifications with confirmation.
 */
export function PlexNotificationsForm() {
  const {
    form,
    isSubmitting,
    isDeleting,
    isLoading,
    onSubmit,
    handleCancel,
    handleDelete,
    initiateDelete,
    lastResults,
  } = usePlexNotifications()

  const { isDiscovering, servers, discoverServers } = usePlexServerDiscovery()
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  if (isLoading) {
    return <PlexNotificationsSkeleton />
  }

  return (
    <>
      <PlexNotificationsConfirmationModal
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
        onConfirm={() => handleDelete()}
        isSubmitting={isDeleting}
      />

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem
          value="plex-notifications"
          className="border-2 border-border rounded-base overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-4 bg-main hover:bg-main hover:no-underline">
            <div className="flex justify-between items-center w-full pr-2">
              <div>
                <h3 className="text-lg font-medium text-black text-left">
                  Plex Notifications
                </h3>
                <p className="text-sm text-black text-left">
                  Configure Sonarr and Radarr to notify Plex of content added,
                  removed, or modified
                </p>
              </div>
              <Badge
                variant="neutral"
                className={cn(
                  'px-2 py-0.5 h-7 text-sm ml-2 mr-2',
                  lastResults?.success
                    ? 'bg-green-500 hover:bg-green-500 text-white'
                    : 'bg-yellow-500 hover:bg-yellow-500 text-white',
                )}
              >
                {lastResults?.success ? 'Configured' : 'Not Configured'}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-0">
            <div className="p-6 border-t border-border">
              <div className="space-y-6">
                {/* Actions section */}
                {lastResults?.success && (
                  <div>
                    <h3 className="font-medium text-foreground mb-2">
                      Actions
                    </h3>
                    <div className="flex flex-wrap items-center gap-4">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          initiateDelete()
                          setShowDeleteConfirmation(true)
                        }}
                        disabled={isDeleting || isSubmitting}
                        variant="error"
                        className="h-8"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="ml-2">Remove Notifications</span>
                      </Button>
                    </div>
                  </div>
                )}

                {lastResults?.success && <Separator />}

                {/* Status section */}
                {lastResults && (
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-md">
                    <h3 className="font-medium text-foreground mb-2">
                      Current Status
                    </h3>
                    <p className="text-sm text-foreground">
                      {lastResults.message}
                    </p>

                    {/* Radarr instances */}
                    {lastResults.results?.radarr?.length > 0 && (
                      <div className="mt-3">
                        <h4 className="font-medium text-sm text-foreground">
                          Radarr Instances
                        </h4>
                        <ul className="mt-1 space-y-1">
                          {lastResults.results.radarr.map((result) => (
                            <li key={result.id} className="text-sm">
                              <span
                                className={`font-medium ${result.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                              >
                                {result.name}
                              </span>
                              <span className="text-foreground ml-2">
                                {result.message}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Sonarr instances */}
                    {lastResults.results?.sonarr?.length > 0 && (
                      <div className="mt-3">
                        <h4 className="font-medium text-sm text-foreground">
                          Sonarr Instances
                        </h4>
                        <ul className="mt-1 space-y-1">
                          {lastResults.results.sonarr.map((result) => (
                            <li key={result.id} className="text-sm">
                              <span
                                className={`font-medium ${result.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                              >
                                {result.name}
                              </span>
                              <span className="text-foreground ml-2">
                                {result.message}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <Separator />

                {/* Configuration form */}
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="space-y-4">
                      <h3 className="font-medium text-sm text-foreground mb-2">
                        Plex Connection Settings
                      </h3>

                      {/* Plex Token Field with Discovery Button */}
                      <FormField
                        control={form.control}
                        name="plexToken"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">
                              Plex Token
                            </FormLabel>
                            <div className="flex space-x-2">
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Your Plex authentication token"
                                  className="flex-1"
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="noShadow"
                                onClick={() => {
                                  if (field.value) {
                                    discoverServers(field.value)
                                  }
                                }}
                                disabled={isDiscovering || !field.value}
                              >
                                {isDiscovering ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <Search className="h-4 w-4 mr-2" />
                                )}
                                Find Servers
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Server Selection Cards */}
                      {servers.length > 0 && (
                        <div className="pt-2 pb-4">
                          <h4 className="text-sm font-medium text-foreground mb-3">
                            Available Servers
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {servers.map((server, index) => (
                              <Card
                                key={`${server.host}-${server.port}-${index}`}
                                className="cursor-pointer hover:border-primary transition-colors flex flex-col"
                              >
                                <CardHeader className="py-3 px-4 pb-2">
                                  <CardTitle className="text-base flex items-center">
                                    <ServerIcon className="h-4 w-4 mr-2 text-primary" />
                                    {server.name}
                                  </CardTitle>
                                  <CardDescription className="text-xs">
                                    {server.local
                                      ? 'Local Connection'
                                      : 'Remote Connection'}
                                    {server.useSsl && ' • Secure'}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="py-2 px-4 text-xs">
                                  <div className="flex items-center space-x-1">
                                    <span className="font-medium">Host:</span>
                                    <span>{server.host}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <span className="font-medium">Port:</span>
                                    <span>{server.port}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <span className="font-medium">SSL:</span>
                                    <span>{server.useSsl ? 'Yes' : 'No'}</span>
                                  </div>
                                </CardContent>
                                <div className="mt-auto px-4 pb-3">
                                  <Button
                                    type="button"
                                    variant="blue"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => {
                                      form.setValue('plexHost', server.host, {
                                        shouldDirty: true,
                                      })
                                      form.setValue('plexPort', server.port, {
                                        shouldDirty: true,
                                      })
                                      form.setValue('useSsl', server.useSsl, {
                                        shouldDirty: true,
                                      })
                                    }}
                                  >
                                    Select
                                  </Button>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      <FormField
                        control={form.control}
                        name="plexHost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">
                              Plex Host
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Plex server IP address or hostname"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="plexPort"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground">
                                Plex Port
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  onChange={(e) =>
                                    field.onChange(
                                      Number.parseInt(e.target.value),
                                    )
                                  }
                                  placeholder="32400"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="useSsl"
                          render={({ field }) => (
                            <FormItem className="flex flex-col justify-end h-full">
                              <div className="flex items-center space-x-2 pt-8">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="text-foreground m-0">
                                  Use SSL
                                </FormLabel>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
                      {form.formState.isDirty && !isSubmitting && (
                        <Button
                          type="button"
                          variant="cancel"
                          onClick={handleCancel}
                          disabled={isSubmitting}
                          className="flex items-center gap-1"
                        >
                          <X className="h-4 w-4" />
                          <span>Cancel</span>
                        </Button>
                      )}

                      <Button
                        type="submit"
                        disabled={isSubmitting || !form.formState.isDirty}
                        className="flex items-center gap-2"
                        variant="blue"
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        <span>
                          {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </span>
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}

export default PlexNotificationsForm
