<?php

namespace App\Http\Controllers;

use App\Jobs\GenerateReportJob;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function generateReport($questionnaireId)
    {
        GenerateReportJob::dispatch($questionnaireId);
        return response()->json(['message' => 'Report generation has been queued.']);
    }
}

