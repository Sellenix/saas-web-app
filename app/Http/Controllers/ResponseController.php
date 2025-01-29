<?php

namespace App\Http\Controllers;

use App\Models\Response;
use Illuminate\Http\Request;

class ResponseController extends Controller
{
    public function getRecentResponses()
    {
        $user = auth()->user();
        $recentResponses = Response::whereHas('questionnaire', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->with('questionnaire:id,title')
        ->orderBy('created_at', 'desc')
        ->take(5)
        ->get()
        ->map(function ($response) {
            return [
                'id' => $response->id,
                'questionnaireTitle' => $response->questionnaire->title,
                'questionnaireId' => $response->questionnaire->id,
                'respondentName' => $response->respondent_name,
                'submittedAt' => $response->created_at->toISOString(),
            ];
        });

        return response()->json($recentResponses);
    }
}

