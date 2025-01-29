public function search(Request $request)
{
    $query = $request->input('query');
    $results = Questionnaire::search($query)->get();
    return response()->json($results);
}

