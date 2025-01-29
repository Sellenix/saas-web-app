<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Questionnaire;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class QuestionnaireControllerTest extends TestCase
{
    use RefreshDatabase;

    public function testIndex()
    {
        $user = User::factory()->create();
        $questionnaires = Questionnaire::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->getJson('/api/questionnaires');

        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    public function testStore()
    {
        $user = User::factory()->create();
        $questionnaireData = [
            'title' => 'Test Questionnaire',
            'description' => 'This is a test questionnaire',
        ];

        $response = $this->actingAs($user)->postJson('/api/questionnaires', $questionnaireData);

        $response->assertStatus(201)
                 ->assertJsonFragment($questionnaireData);
    }
}

