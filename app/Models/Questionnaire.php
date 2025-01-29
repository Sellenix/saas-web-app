<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Questionnaire extends Model
{
    use Searchable;

    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
        ];
    }
}

