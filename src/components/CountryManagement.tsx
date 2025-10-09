import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CountryManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Country Management</h2>
        <Button>Add Country</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Countries</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Country management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}