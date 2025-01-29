<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class QuestionnaireUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $questionnaireId;

    public function __construct($questionnaireId)
    {
        $this->questionnaireId = $questionnaireId;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('questionnaire.' . $this->questionnaireId);
    }
}

