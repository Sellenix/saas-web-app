<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Questionnaire;
use App\Services\ReportService;

class GenerateReportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $questionnaireId;

    public function __construct($questionnaireId)
    {
        $this->questionnaireId = $questionnaireId;
    }

    public function handle(ReportService $reportService)
    {
        $questionnaire = Questionnaire::findOrFail($this->questionnaireId);
        $reportService->generateReport($questionnaire);
    }
}

