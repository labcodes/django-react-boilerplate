from django.urls import reverse


def test_sample():
    assert True


def test_sample_api_view(client, snapshot):
    response = client.get(reverse("sample_api_view"))
    snapshot.assert_match(response.content, "sample_api_view.json")
