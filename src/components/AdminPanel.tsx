import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { CountryManagement } from './CountryManagement';
import { CreateCountryAdmin } from './CreateCountryAdmin';
import { CountrySelector } from './CountrySelector';
import { UserManagement } from './UserManagement';
import { useLanguage } from '@/hooks/useLanguage';
import { getTranslation } from '@/lib/translations';

export function AdminPanel() {
  const { user, isGlobalAdmin } = useAuth();
  const { currentLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('countries');

  const t = (key: string) => getTranslation(currentLanguage, key);

  if (!user || user.role !== 'global-admin') {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
        <p className="text-muted-foreground">You do not have permission to access this panel.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Global Admin Panel
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="countries">{t('countries')}</TabsTrigger>
          <TabsTrigger value="create-admin">{t('createCountryAdmin')}</TabsTrigger>
          <TabsTrigger value="select-country">{t('selectActiveCountry')}</TabsTrigger>
          <TabsTrigger value="users">{t('users')}</TabsTrigger>
        </TabsList>

        <TabsContent value="countries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('countries')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CountryManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create-admin" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('createCountryAdmin')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateCountryAdmin />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="select-country" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('selectActiveCountry')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CountrySelector />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('users')}</CardTitle>
            </CardHeader>
            <CardContent>
              <UserManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}