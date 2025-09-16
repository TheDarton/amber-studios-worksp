import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, XCircle } from '@phosphor-icons/react';
import { CSVImportJob, CSVFileType, Country } from '@/types';
import { toast } from 'sonner';

export function CSVImport() {
  const [importJobs, setImportJobs] = useKV<CSVImportJob[]>('csv-import-jobs', []);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<CSVFileType>('sm_schedule');
  const [country, setCountry] = useState<Country>('poland');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
    } else {
      toast.error('PLEASE SELECT A VALID CSV FILE');
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error('PLEASE SELECT A FILE TO UPLOAD');
      return;
    }

    const job: CSVImportJob = {
      id: Date.now().toString(),
      fileName: selectedFile.name,
      fileType,
      country,
      status: 'uploading',
      rowCount: 0,
      validRows: 0,
      errors: [],
      columnMapping: {},
      uploadedBy: 'admin',
      uploadedAt: new Date()
    };

    setImportJobs(currentJobs => [...(currentJobs || []), job]);
    
    // Simulate processing
    setTimeout(() => {
      setImportJobs(currentJobs => 
        (currentJobs || []).map(j => 
          j.id === job.id 
            ? { ...j, status: 'completed', rowCount: 150, validRows: 148 }
            : j
        )
      );
      toast.success('CSV file imported successfully');
    }, 2000);

    setSelectedFile(null);
    toast.info('CSV upload started');
  };

  const getStatusBadge = (status: CSVImportJob['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle size={12} className="mr-1" />Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle size={12} className="mr-1" />Failed</Badge>;
      case 'uploading':
      case 'mapping':
      case 'validating':
      case 'previewing':
      case 'importing':
        return <Badge variant="secondary">Processing...</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const fileTypes = [
    { value: 'sm_schedule', label: 'SM Schedule' },
    { value: 'dealer_schedule', label: 'Dealer Schedule' },
    { value: 'daily_mistakes', label: 'Daily Mistakes' },
    { value: 'mistake_statistics', label: 'Mistake Statistics' }
  ];

  const countries = [
    { value: 'poland', label: 'Poland' },
    { value: 'georgia', label: 'Georgia' },
    { value: 'colombia', label: 'Colombia' },
    { value: 'latvia', label: 'Latvia' },
    { value: 'lithuania', label: 'Lithuania' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload size={20} />
            CSV File Import
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>File Type</Label>
              <Select value={fileType} onValueChange={(value: CSVFileType) => setFileType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fileTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Country</Label>
              <Select value={country} onValueChange={(value: Country) => setCountry(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="csv-file">CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
          
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile}
            className="w-full md:w-auto"
          >
            <Upload size={16} className="mr-2" />
            Upload CSV
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            Import History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!importJobs || importJobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No import jobs yet. Upload a CSV file to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rows</TableHead>
                    <TableHead>Uploaded At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.fileName}</TableCell>
                      <TableCell>
                        {fileTypes.find(t => t.value === job.fileType)?.label || job.fileType}
                      </TableCell>
                      <TableCell className="capitalize">{job.country}</TableCell>
                      <TableCell>{getStatusBadge(job.status)}</TableCell>
                      <TableCell>
                        {job.rowCount > 0 ? `${job.validRows}/${job.rowCount}` : '-'}
                      </TableCell>
                      <TableCell>{job.uploadedAt.toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>GitHub Repository CSV Import</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              CSV files are automatically imported from the public GitHub repository. Each country has 4 CSV files:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Expected File Names:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <code>{country}_sm_schedule.csv</code></li>
                  <li>• <code>{country}_dealer_schedule.csv</code></li>
                  <li>• <code>{country}_daily_mistakes.csv</code></li>
                  <li>• <code>{country}_mistake_statistics.csv</code></li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Repository Structure:</h4>
                <div className="text-sm text-muted-foreground font-mono bg-muted/50 p-3 rounded">
                  <div>/public/</div>
                  <div>  ├── poland_sm_schedule.csv</div>
                  <div>  ├── poland_dealer_schedule.csv</div>
                  <div>  ├── georgia_sm_schedule.csv</div>
                  <div>  └── ...</div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="github-repo">GitHub Repository URL</Label>
              <Input
                id="github-repo"
                placeholder="https://github.com/your-org/csv-data"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL (for Power Automate)</Label>
              <Input
                id="webhook-url"
                value="https://your-app.com/api/webhook/csv-import"
                readOnly
              />
            </div>
            <Button disabled>
              Sync from Repository (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}